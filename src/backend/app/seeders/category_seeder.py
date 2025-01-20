from typing import List, Optional, TypedDict

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.category import Category
from app.models.enums import CategoryType


class CategoryDict(TypedDict):
    name: str
    type: CategoryType
    description: str
    children: Optional[List["CategoryDict"]]


CATEGORIES: List[CategoryDict] = [
    # Thể loại chính
    {
        "name": "Tiểu thuyết",
        "type": CategoryType.CATEGORY,
        "description": "Các tác phẩm tiểu thuyết dài",
        "children": [
            {
                "name": "Tiểu thuyết Ngôn tình",
                "type": CategoryType.GENRE,
                "description": "Các tác phẩm tình cảm lãng mạn",
            },
            {
                "name": "Tiểu thuyết Kiếm hiệp",
                "type": CategoryType.GENRE,
                "description": "Các tác phẩm về võ thuật, giang hồ",
            },
        ],
    },
    {
        "name": "Truyện ngắn",
        "type": CategoryType.CATEGORY,
        "description": "Các tác phẩm truyện ngắn",
        "children": [
            {
                "name": "Truyện teen",
                "type": CategoryType.GENRE,
                "description": "Các tác phẩm dành cho thanh thiếu niên",
            },
            {
                "name": "Truyện cười",
                "type": CategoryType.GENRE,
                "description": "Các tác phẩm hài hước",
            },
        ],
    },
    {
        "name": "Light Novel",
        "type": CategoryType.CATEGORY,
        "description": "Tiểu thuyết minh họa Nhật Bản",
        "children": [
            {
                "name": "Isekai",
                "type": CategoryType.GENRE,
                "description": "Thể loại xuyên không, chuyển sinh",
            },
            {
                "name": "School Life",
                "type": CategoryType.GENRE,
                "description": "Thể loại học đường",
            },
        ],
    },
    # Thể loại độc lập
    {
        "name": "Hành động",
        "type": CategoryType.GENRE,
        "description": "Các tác phẩm có nhiều cảnh hành động",
    },
    {
        "name": "Phiêu lưu",
        "type": CategoryType.GENRE,
        "description": "Các tác phẩm về cuộc phiêu lưu, khám phá",
    },
    {
        "name": "Viễn tưởng",
        "type": CategoryType.GENRE,
        "description": "Các tác phẩm khoa học viễn tưởng",
    },
    {
        "name": "Kinh dị",
        "type": CategoryType.GENRE,
        "description": "Các tác phẩm kinh dị, ma quái",
    },
    {
        "name": "Tâm lý",
        "type": CategoryType.GENRE,
        "description": "Các tác phẩm về đời sống tâm lý",
    },
]
